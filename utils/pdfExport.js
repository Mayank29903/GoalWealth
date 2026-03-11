let pdfDepsPromise;

const loadPdfDeps = async () => {
  if (!pdfDepsPromise) {
    pdfDepsPromise = Promise.all([import('html2canvas'), import('jspdf')]).then(
      ([html2canvasModule, jsPDFModule]) => ({
        html2canvas: html2canvasModule.default,
        jsPDF: jsPDFModule.default,
      })
    );
  }

  return pdfDepsPromise;
};

const createOffscreenClone = (sourceElement, backgroundColor) => {
  const wrapper = document.createElement('div');
  const sourceWidth = Math.ceil(
    Math.max(sourceElement.getBoundingClientRect().width, sourceElement.scrollWidth)
  );

  wrapper.style.position = 'fixed';
  wrapper.style.top = '0';
  wrapper.style.left = '-100000px';
  wrapper.style.zIndex = '-1';
  wrapper.style.pointerEvents = 'none';
  wrapper.style.padding = '0';
  wrapper.style.margin = '0';
  wrapper.style.width = `${Math.max(sourceWidth, 320)}px`;
  wrapper.style.backgroundColor = backgroundColor;
  wrapper.setAttribute('data-pdf-clone', 'true');

  const clone = sourceElement.cloneNode(true);
  clone.querySelectorAll('[data-export-ignore="true"]').forEach((node) => node.remove());
  clone.querySelectorAll('[data-html2canvas-ignore="true"]').forEach((node) => node.remove());
  wrapper.appendChild(clone);

  document.body.appendChild(wrapper);

  return { wrapper, clone };
};

const getSectionBreakpointsPx = ({ cloneRoot, scale }) => {
  const sections = Array.from(cloneRoot.querySelectorAll('[data-pdf-section="true"]'));
  if (sections.length < 2) return [];

  const rootRect = cloneRoot.getBoundingClientRect();

  return sections
    .map((section) => Math.round((section.getBoundingClientRect().top - rootRect.top) * scale))
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((a, b) => a - b);
};

const findBestSectionBoundary = ({ breakpointsPx, offsetY, tentativeEndY, minSlicePx }) => {
  let best = null;

  for (const point of breakpointsPx) {
    if (point <= offsetY + minSlicePx) continue;
    if (point > tentativeEndY) break;
    best = point;
  }

  return best;
};

const addCanvasToPdfInSlices = ({ canvas, pdf, margin, breakpointsPx = [] }) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;

  const pxPerPt = canvas.width / printableWidth;
  const pageSliceHeightPx = Math.floor(printableHeight * pxPerPt);

  let offsetY = 0;
  let pageIndex = 0;

  while (offsetY < canvas.height) {
    let sliceHeight = Math.min(pageSliceHeightPx, canvas.height - offsetY);

    const hasMoreContent = offsetY + sliceHeight < canvas.height;
    if (hasMoreContent && breakpointsPx.length > 0) {
      const minSlicePx = Math.max(Math.floor(pageSliceHeightPx * 0.45), 300);
      const bestBoundary = findBestSectionBoundary({
        breakpointsPx,
        offsetY,
        tentativeEndY: offsetY + sliceHeight,
        minSlicePx,
      });

      if (bestBoundary) {
        const boundedSlice = bestBoundary - offsetY;
        if (boundedSlice > 0) {
          sliceHeight = boundedSlice;
        }
      }
    }

    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = sliceHeight;

    const ctx = pageCanvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to create canvas context for PDF rendering.');
    }

    ctx.drawImage(
      canvas,
      0,
      offsetY,
      canvas.width,
      sliceHeight,
      0,
      0,
      canvas.width,
      sliceHeight
    );

    if (pageIndex > 0) {
      pdf.addPage();
    }

    const imageData = pageCanvas.toDataURL('image/png');
    const sliceHeightPt = sliceHeight / pxPerPt;

    pdf.addImage(
      imageData,
      'PNG',
      margin,
      margin,
      printableWidth,
      sliceHeightPt,
      undefined,
      'FAST'
    );

    offsetY += sliceHeight;
    pageIndex += 1;
  }
};

export const exportElementToPdf = async ({
  element,
  filename,
  backgroundColor = '#f3f6fb',
  scale = 2,
  margin = 24,
}) => {
  if (!element) {
    throw new Error('Missing export element.');
  }

  const { html2canvas, jsPDF } = await loadPdfDeps();
  const { wrapper, clone } = createOffscreenClone(element, backgroundColor);

  try {
    const breakpointsPx = getSectionBreakpointsPx({ cloneRoot: clone, scale });

    const canvas = await html2canvas(wrapper, {
      scale,
      useCORS: true,
      backgroundColor,
      logging: false,
      ignoreElements: (target) =>
        target.dataset?.exportIgnore === 'true' ||
        target.dataset?.html2canvasIgnore === 'true',
    });

    const pdf = new jsPDF('p', 'pt', 'a4');
    addCanvasToPdfInSlices({ canvas, pdf, margin, breakpointsPx });
    pdf.save(filename);
  } finally {
    wrapper.remove();
  }
};

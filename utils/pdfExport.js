import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  const clone = sourceElement.cloneNode(true);
  clone.querySelectorAll('[data-export-ignore="true"]').forEach((node) => node.remove());
  clone.querySelectorAll('[data-html2canvas-ignore="true"]').forEach((node) => node.remove());
  wrapper.appendChild(clone);

  document.body.appendChild(wrapper);

  return wrapper;
};

const addCanvasToPdfInSlices = ({ canvas, pdf, margin }) => {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;

  const pxPerPt = canvas.width / printableWidth;
  const pageSliceHeightPx = Math.floor(printableHeight * pxPerPt);

  let offsetY = 0;
  let pageIndex = 0;

  while (offsetY < canvas.height) {
    const sliceHeight = Math.min(pageSliceHeightPx, canvas.height - offsetY);
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

  const offscreenNode = createOffscreenClone(element, backgroundColor);

  try {
    const canvas = await html2canvas(offscreenNode, {
      scale,
      useCORS: true,
      backgroundColor,
      logging: false,
      ignoreElements: (target) =>
        target.dataset?.exportIgnore === 'true' ||
        target.dataset?.html2canvasIgnore === 'true',
    });

    const pdf = new jsPDF('p', 'pt', 'a4');
    addCanvasToPdfInSlices({ canvas, pdf, margin });
    pdf.save(filename);
  } finally {
    offscreenNode.remove();
  }
};

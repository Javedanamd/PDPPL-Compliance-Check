import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

async function captureElement(el: HTMLElement) {
  return html2canvas(el, {
    backgroundColor: '#ffffff',
    scale: 2,
    useCORS: true,
  })
}

export async function exportElementAsPng(el: HTMLElement, fileName = 'PDPPL-Dashboard.png') {
  const canvas = await captureElement(el)
  const link = document.createElement('a')
  link.download = fileName
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function exportElementAsPdf(el: HTMLElement, fileName = 'PDPPL-Dashboard.pdf') {
  const canvas = await captureElement(el)
  const imgData = canvas.toDataURL('image/png')
  const orientation = canvas.width > canvas.height ? 'l' : 'p'
  const pdf = new jsPDF({ orientation, unit: 'px', format: [canvas.width, canvas.height] })
  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
  pdf.save(fileName)
}

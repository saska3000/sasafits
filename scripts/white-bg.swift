// Вырезает блюдо с фотографии и кладёт его на белый квадратный фон (встроенное «выделение объекта» macOS).
// Запуск: swift scripts/white-bg.swift <входное фото> <выходной .jpg> [размер, по умолчанию 600]
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count >= 3 else {
  print("Использование: swift white-bg.swift in.jpg out.jpg [600]")
  exit(1)
}
let size = args.count > 3 ? CGFloat(Double(args[3]) ?? 600) : 600

guard let input = CIImage(contentsOf: URL(fileURLWithPath: args[1])) else {
  print("Не открылось фото")
  exit(1)
}

let request = VNGenerateForegroundInstanceMaskRequest()
let handler = VNImageRequestHandler(ciImage: input)
try handler.perform([request])
guard let result = request.results?.first else {
  print("Блюдо на фото не найдено")
  exit(2)
}
let buffer = try result.generateMaskedImage(ofInstances: result.allInstances, from: handler, croppedToInstancesExtent: true)
let cut = CIImage(cvPixelBuffer: buffer)

// Вписываем вырезанное блюдо в квадрат с полями 6 %
let pad = size * 0.06
let scale = min((size - 2 * pad) / cut.extent.width, (size - 2 * pad) / cut.extent.height)
let scaled = cut.transformed(by: CGAffineTransform(scaleX: scale, y: scale))
let dx = (size - scaled.extent.width) / 2 - scaled.extent.minX
let dy = (size - scaled.extent.height) / 2 - scaled.extent.minY
let placed = scaled.transformed(by: CGAffineTransform(translationX: dx, y: dy))
let white = CIImage(color: .white).cropped(to: CGRect(x: 0, y: 0, width: size, height: size))
let final = placed.composited(over: white)

let ctx = CIContext()
let cs = CGColorSpace(name: CGColorSpace.sRGB)!
try ctx.writeJPEGRepresentation(of: final, to: URL(fileURLWithPath: args[2]), colorSpace: cs, options: [
  kCGImageDestinationLossyCompressionQuality as CIImageRepresentationOption: 0.8,
])
print("ok")

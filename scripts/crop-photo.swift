// Делает из фото квадрат «крупным планом»: вырезает середину (или нужную точку) и уменьшает.
// Запуск: swift scripts/crop-photo.swift <вход> <выход.jpg> [размер=720] [приближение=1.15] [центр X 0..1=0.5] [центр Y 0..1=0.5]
// Центр Y считается сверху вниз: 0.3 — ближе к верху кадра.
import AppKit

let a = CommandLine.arguments
guard a.count >= 3, let src = NSImage(contentsOfFile: a[1]),
      let cg = src.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
  print("Не открылось фото"); exit(1)
}
let size = a.count > 3 ? CGFloat(Double(a[3]) ?? 720) : 720
let zoom = a.count > 4 ? CGFloat(Double(a[4]) ?? 1.15) : 1.15
let cx = a.count > 5 ? CGFloat(Double(a[5]) ?? 0.5) : 0.5
let cy = a.count > 6 ? CGFloat(Double(a[6]) ?? 0.5) : 0.5

let w = CGFloat(cg.width), h = CGFloat(cg.height)
let side = min(w, h) / max(zoom, 1)
var x = cx * w - side / 2, y = cy * h - side / 2
x = min(max(0, x), w - side); y = min(max(0, y), h - side)
guard let cut = cg.cropping(to: CGRect(x: x, y: y, width: side, height: side).integral) else { exit(2) }

let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(size), pixelsHigh: Int(size), bitsPerSample: 8,
                           samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
NSGraphicsContext.current?.imageInterpolation = .high
NSImage(cgImage: cut, size: NSSize(width: side, height: side)).draw(in: NSRect(x: 0, y: 0, width: size, height: size))
NSGraphicsContext.restoreGraphicsState()
let data = rep.representation(using: .jpeg, properties: [.compressionFactor: 0.8])!
try! data.write(to: URL(fileURLWithPath: a[2]))
print("ok")

// Собирает картинки в одну «простыню» с подписями, чтобы быстро выбрать лучшие.
// Запуск: swift scripts/contact-sheet.swift out.jpg "подпись|путь" "подпись|путь" …
import AppKit

let args = Array(CommandLine.arguments.dropFirst())
guard args.count >= 2 else { exit(1) }
let out = args[0]
let items = args.dropFirst().map { $0.split(separator: "|", maxSplits: 1).map(String.init) }

let cols = 6
let cell: CGFloat = 200
let labelH: CGFloat = 22
let rows = Int(ceil(Double(items.count) / Double(cols)))
let W = CGFloat(cols) * cell
let H = CGFloat(rows) * (cell + labelH)

let img = NSImage(size: NSSize(width: W, height: H))
img.lockFocus()
NSColor.white.setFill()
NSRect(x: 0, y: 0, width: W, height: H).fill()
for (i, it) in items.enumerated() {
  let col = i % cols
  let row = i / cols
  let x = CGFloat(col) * cell
  let yTop = H - CGFloat(row) * (cell + labelH)
  let label = it[0]
  (label as NSString).draw(at: NSPoint(x: x + 4, y: yTop - labelH + 3), withAttributes: [
    .font: NSFont.boldSystemFont(ofSize: 14), .foregroundColor: NSColor.black,
  ])
  if it.count > 1, let pic = NSImage(contentsOfFile: it[1]) {
    let s = pic.size
    let k = min((cell - 6) / s.width, (cell - 6) / s.height)
    let w = s.width * k, h = s.height * k
    pic.draw(in: NSRect(x: x + (cell - w) / 2, y: yTop - labelH - cell + (cell - h) / 2, width: w, height: h))
  }
}
img.unlockFocus()
let rep = NSBitmapImageRep(data: img.tiffRepresentation!)!
try rep.representation(using: .jpeg, properties: [.compressionFactor: 0.7])!.write(to: URL(fileURLWithPath: out))
print("ok")

/**
 * Лёгкий отклик телефона.
 * Android — обычная вибрация. iPhone сайтам вибрировать не даёт, но с iOS 18 даёт «тик»,
 * когда переключается системный переключатель — его и щёлкаем незаметно.
 * Срабатывает только сразу после нажатия пользователя.
 */
export function haptic() {
  try {
    navigator.vibrate?.(30);
  } catch {
    /* нет вибрации */
  }
  try {
    const label = document.createElement('label');
    label.ariaHidden = 'true';
    label.style.display = 'none';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.setAttribute('switch', '');
    label.appendChild(input);
    document.head.appendChild(label);
    label.click();
    document.head.removeChild(label);
  } catch {
    /* не страшно */
  }
}

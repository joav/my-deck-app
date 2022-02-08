export function emitEvent<T>(event: string, data?: T) {
  window.dispatchEvent(new CustomEvent(event, {
    detail: data
  }));
}

export function onEvent<T>(event: string, callback: (e: CustomEvent<T>) => any) {
  window.addEventListener(event, (e) => {
    callback((e as CustomEvent<T>));
  });
}

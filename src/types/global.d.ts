interface VisualViewport extends EventTarget {
  readonly offsetLeft: number;
  readonly offsetTop: number;
  readonly pageLeft: number;
  readonly pageTop: number;
  readonly width: number;
  readonly height: number;
  readonly scale: number;
  onresize: ((this: VisualViewport, ev: Event) => unknown) | null;
  onscroll: ((this: VisualViewport, ev: Event) => unknown) | null;
}

interface Window {
  visualViewport?: VisualViewport;
}

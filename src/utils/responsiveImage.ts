// Only advertise variants that exist. Remote event uploads require storage-side resizing.
export function responsiveImage(src: string) {
  if (!/^\/images\/(bt[1-4]\.jpg|events_experience\/img_[1-3]\.jpeg)$/.test(src)) return {};
  const variant = (width: number) => src.replace(/(\.[^.]+)$/, `-${width}$1`);
  return { srcSet: `${variant(480)} 480w, ${variant(960)} 960w`, sizes: "(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 560px" };
}

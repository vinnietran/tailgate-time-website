import { founder, customerStories, productScreenshots } from "../data/publicContent";
export function FounderStory() {
  if (!founder) return null;
  return <section className="audit-section"><h2>Why we built TailgateTime</h2><img className="audit-portrait" src={founder.photo} alt={founder.name} /><h3>{founder.name}</h3><p>{founder.story}</p><a href={founder.profileUrl}>Meet {founder.name}</a></section>;
}
export function CustomerStories() {
  if (!customerStories.length) return null;
  return <section className="audit-section"><h2>Built for real tailgaters</h2><div className="audit-grid">{customerStories.map(story => <article key={story.sourceUrl}><img className="audit-portrait" src={story.photo} alt={story.name} /><blockquote>{story.quote}</blockquote><p>{story.name} · {story.role}</p><p>{story.outcome}</p><a href={story.sourceUrl}>Read the review · {story.date}</a></article>)}</div></section>;
}
export function ProductScreenshots() {
  if (!productScreenshots.length) return null;
  return <div className="audit-grid">{productScreenshots.map(item => <figure key={item.src}><img src={item.src} alt={item.alt} loading="lazy" /><figcaption>{item.caption}</figcaption></figure>)}</div>;
}

import React from "react";
import { PublicTopNav } from "../components/PublicTopNav";
import SiteFooter from "../components/SiteFooter";
import userGuideMarkdown from "../content/USER_GUIDE.md?raw";

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

function renderMarkdown(markdown: string) {
  const lines = markdown.split(/\r?\n/);
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let keyIndex = 0;

  const flushList = () => {
    if (listItems.length === 0) return;
    const listKey = `list-${keyIndex++}`;
    nodes.push(
      <ul key={listKey} className="user-guide-list">
        {listItems.map((item, index) => (
          <li key={`${listKey}-${index}`}>{renderInline(item, `${listKey}-${index}`)}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (line.startsWith("- ")) {
      listItems.push(line.slice(2).trim());
      return;
    }

    flushList();

    if (!line) return;
    if (line === "---") {
      nodes.push(<hr key={`hr-${keyIndex++}`} className="user-guide-divider" />);
      return;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={`h3-${keyIndex++}`}>{renderInline(line.slice(4).trim(), `h3-${keyIndex}`)}</h3>
      );
      return;
    }
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={`h2-${keyIndex++}`}>{renderInline(line.slice(3).trim(), `h2-${keyIndex}`)}</h2>
      );
      return;
    }
    if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={`h1-${keyIndex++}`}>{renderInline(line.slice(2).trim(), `h1-${keyIndex}`)}</h1>
      );
      return;
    }
    nodes.push(
      <p key={`p-${keyIndex++}`}>{renderInline(line, `p-${keyIndex}`)}</p>
    );
  });

  flushList();
  return nodes;
}

export default function UserGuide() {
  return (
    <main className="user-guide-page">
      <PublicTopNav />
      <section className="user-guide-shell">
        <article className="user-guide-card">
          {renderMarkdown(userGuideMarkdown)}
        </article>
      </section>
      <SiteFooter />
    </main>
  );
}

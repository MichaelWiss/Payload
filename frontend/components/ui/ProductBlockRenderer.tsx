import type { ProductBlock } from '@/types/payload';

interface ProductBlockRendererProps {
  blocks: ProductBlock[];
}

function FeatureBlock({ block }: { block: ProductBlock }) {
  const bodyText = block.body
    ?.map((node) => node.children?.map((child) => child.text).join(''))
    .join(' ');

  const mediaUrl =
    block.media && typeof block.media === 'object' ? block.media.url : null;

  return (
    <div className="product-block feature-block">
      {block.heading && <h3 className="block-heading">{block.heading}</h3>}
      {bodyText && <div className="block-body">{bodyText}</div>}
      {mediaUrl && (
        <div className="block-media">
          <img src={mediaUrl} alt={block.heading || 'Product feature'} />
        </div>
      )}
    </div>
  );
}

function SpecsBlock({ block }: { block: ProductBlock }) {
  if (!block.items || block.items.length === 0) {
    return null;
  }

  return (
    <div className="product-block specs-block">
      {block.heading && <h3 className="block-heading">{block.heading}</h3>}
      <dl className="specs-list">
        {block.items.map((item, index) => (
          <div key={index} className="spec-item">
            <dt className="spec-label">{item.label}</dt>
            <dd className="spec-value">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ProductBlockRenderer({ blocks }: ProductBlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="product-blocks">
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'feature':
            return <FeatureBlock key={block.id || index} block={block} />;
          case 'specs':
            return <SpecsBlock key={block.id || index} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

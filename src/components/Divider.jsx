/**
 * Divider — couture ornamental gold divider: ◆ line ◆
 * The lines carry a slow shimmer sweep and the gem pulses gently.
 */
export default function Divider() {
  return (
    <div className="tct-divider" aria-hidden="true">
      <span className="tct-divider__line" />
      <span className="tct-divider__gem">◆</span>
      <span className="tct-divider__line" />
    </div>
  );
}

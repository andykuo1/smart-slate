import { useClapComments, useClapperDispatch } from '@/stores/clapper';

/**
 * @param {object} props
 * @param {import('@/stores/clapper/Store').ClapperId} props.clapperId
 * @param {import('@/stores/clapper/Store').ClapId} props.clapId
 */
export default function ClapCommentParts({ clapperId, clapId }) {
  const clapComments = useClapComments(clapperId, clapId);
  const changeClapComments = useClapperDispatch(
    (ctx) => ctx.changeClapComments,
  );

  /** @param {import('react').ChangeEvent} e */
  function onChange(e) {
    const target = /** @type {HTMLTextAreaElement} */ (e.target);
    if (!clapId) {
      // let clap = createClap();
      // clap.comments = target.value;
      // addClap(clapperId, clap);
      // focusClap(clapperId, clap.clapId);
    } else {
      changeClapComments(clapperId, clapId, target.value);
    }
  }

  return (
    <ClapperCommentField
      className="flex-1"
      value={clapComments}
      onChange={onChange}
      disabled={!clapperId}
    />
  );
}

/**
 * @param {object} props
 * @param {string} props.className
 * @param {string} props.value
 * @param {boolean} props.disabled
 * @param {import('react').ChangeEventHandler<HTMLTextAreaElement>} props.onChange
 */
function ClapperCommentField({ className, value, disabled, onChange }) {
  return (
    <textarea
      style={{ lineHeight: '1em' }}
      className={
        'my-1 w-full resize-none rounded-xl bg-transparent p-2 font-mono text-[1.5em] placeholder:opacity-30' +
        ' ' +
        className
      }
      value={value}
      onChange={onChange}
      placeholder="Comments"
      disabled={disabled}
    />
  );
}

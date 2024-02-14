import {
  forwardRef,
  ForwardedRef,
  ClassAttributes,
  InputHTMLAttributes,
} from 'react';

const Textarea = forwardRef(
  (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLTextAreaElement> &
      InputHTMLAttributes<HTMLTextAreaElement>,
    ref: ForwardedRef<HTMLTextAreaElement>
  ) => (
    <textarea
      ref={ref}
      {...props}
      className="textarea bg-neutral textarea-bordered w-full mr-4 h-40"
    />
  )
);

Textarea.displayName = 'Textarea';

export default Textarea;

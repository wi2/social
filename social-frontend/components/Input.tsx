import {
  forwardRef,
  ForwardedRef,
  ClassAttributes,
  InputHTMLAttributes,
} from 'react';

const Input = forwardRef(
  (
    props: JSX.IntrinsicAttributes &
      ClassAttributes<HTMLInputElement> &
      InputHTMLAttributes<HTMLInputElement>,
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <input ref={ref} {...props} className="input input-bordered w-full mr-4" />
  )
);

Input.displayName = 'Input';

export default Input;

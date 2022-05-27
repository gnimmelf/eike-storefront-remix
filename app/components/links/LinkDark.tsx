import { Link } from '@remix-run/react';

const LinkDark = ({ className, ...props }) => (
    <Link
        {...props}
        className={`text-brand-pohutukawa hover:text-brand-pohutukawa_hover ${className}`}
    />
);

export { LinkDark };

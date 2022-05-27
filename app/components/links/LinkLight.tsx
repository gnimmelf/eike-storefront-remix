import { Link } from '@remix-run/react';

const LinkLight = ({ className, ...props }) => (
    <Link
        {...props}
        className={`text-brand-chardon hover:text-brand-chardon_hover ${className} `}
    />
);

export { LinkLight };

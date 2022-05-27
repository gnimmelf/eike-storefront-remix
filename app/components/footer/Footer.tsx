import { RootLoaderData } from '~/root';
import { LinkLight as Link } from '~/components/links/LinkLight';

const navigation = {
    support: [
        { name: 'Help', href: '#' },
        { name: 'Track order', href: '#' },
        { name: 'Shipping', href: '#' },
        { name: 'Returns', href: '#' },
    ],
    company: [
        { name: 'About', href: '#' },
        { name: 'Blog', href: 'https://eikestudio.no' },
        { name: 'Corporate responsibility', href: '#' },
        { name: 'Press', href: '#' },
    ],
};

export default function Footer({
    collections,
}: {
    collections: RootLoaderData['collections'];
}) {
    return (
        <footer
            className="mt-24 border-t bg-brand-taupe text-brand-chardon"
            aria-labelledby="footer-heading"
        >
            <h2 id="footer-heading" className="sr-only">
                Footer
            </h2>
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 ">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="grid grid-cols-2 gap-8 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold tracking-wider uppercase">
                                    Shop
                                </h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    {collections.map((collection) => (
                                        <li key={collection.id}>
                                            <Link
                                                className=""
                                                to={
                                                    '/collections/' +
                                                    collection.slug
                                                }
                                                prefetch="intent"
                                                key={collection.id}
                                            >
                                                {collection.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold tracking-wider uppercase">
                                    Support
                                </h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    {navigation.support.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className="text-base text-brand-chardon hover:text-brand-chardon_hover"
                                            >
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold  tracking-wider uppercase">
                                    Company
                                </h3>
                                <ul role="list" className="mt-4 space-y-4">
                                    {navigation.company.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className="text-base text-brand-chardon hover:text-brand-chardon_hover"
                                            >
                                                {item.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

import { HomeIcon } from '@heroicons/react/solid';
import { LinkDark } from '~/components/links/LinkDark';

export function Breadcrumbs({
    items,
}: {
    items: { name: string; slug: string; id: string }[];
}) {
    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol
                role="list"
                className="flex items-center space-x-1 md:space-x-4"
            >
                <li>
                    <div>
                        <LinkDark
                            to="/"
                            className="text-brand-pohutukawa hover:text-brand-verdun"
                        >
                            <HomeIcon
                                className="flex-shrink-0 h-5 w-5"
                                aria-hidden="true"
                            />
                            <span className="sr-only">Home</span>
                        </LinkDark>
                    </div>
                </li>
                {items
                    .filter((item) => item.name !== '__root_collection__')
                    .map((item, index) => (
                        <li key={item.name}>
                            <div className="flex items-center">
                                <svg
                                    className="flex-shrink-0 h-5 w-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                >
                                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                                </svg>
                                <LinkDark
                                    to={'/collections/' + item.slug}
                                    className="ml-2 md:ml-4 text-xs md:text-sm font-medium"
                                >
                                    {item.name}
                                </LinkDark>
                            </div>
                        </li>
                    ))}
            </ol>
        </nav>
    );
}

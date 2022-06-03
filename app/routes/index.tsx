import React from 'react';
import { useLoaderData } from '@remix-run/react';
import { getCollections } from '~/providers/collections/collections';
import { CollectionCard } from '~/components/collections/CollectionCard';

const headerTextStyle = {
    filter: 'drop-shadow(.5rem .5rem .5rem white)',
};

export async function loader({ request }: any) {
    const collections = await getCollections(request);
    return {
        collections,
    };
}

type LoaderData = Awaited<ReturnType<typeof loader>>;

export default function Index() {
    const { collections } = useLoaderData<LoaderData>();
    return (
        <>
            <div className="relative">
                {/* Decorative image and overlay */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 overflow-hidden"
                >
                    <img
                        className="absolute inset-0 w-full"
                        src="/header-image.jpg"
                        alt="header"
                    />
                    <div className="absolute inset-0 " />
                </div>
                <div aria-hidden="true" className="absolute inset-0" />
                <div className="relative max-w-3xl mx-auto py-32 px-6 flex flex-col items-center text-center sm:py-64 lg:px-0">
                    <div className="relative">
                        <h1
                            className="text-6xl font-extrabold tracking-normal lg:text-6xl text-brand-pohutukawa"
                            style={headerTextStyle}
                        >
                            Eike Studio
                        </h1>
                    </div>
                    <p
                        className="mt-4 text-2xl text-brand-pohutukawa"
                        style={headerTextStyle}
                    >
                        Butikk
                    </p>
                </div>
            </div>

            <section
                aria-labelledby="category-heading"
                className="pt-24 sm:pt-32 xl:max-w-7xl xl:mx-auto xl:px-8"
            >
                <div className="px-4 sm:px-6 lg:px-8 xl:px-0">
                    <h2
                        id="category-heading"
                        className="text-2xl font-light tracking-tight text-brand-pohutukawa"
                    >
                        Shop by Category
                    </h2>
                </div>

                <div className="mt-4 flow-root">
                    <div className="-my-2">
                        <div className="box-content py-2 px-2 relative overflow-x-auto xl:overflow-visible">
                            <div className="grid justify-items-center grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-8 sm:px-6 lg:px-8 xl:relative xl:px-0 xl:space-x-0 xl:gap-x-8">
                                {collections.map((collection) => (
                                    <CollectionCard
                                        key={collection.id}
                                        collection={collection}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 px-4 sm:hidden">
                    <a
                        href="~/routes/__cart/index#"
                        className="block text-sm font-semibold text-primary-600 hover:text-primary-500"
                    >
                        Browse all categories
                        <span aria-hidden="true"> &rarr;</span>
                    </a>
                </div>
            </section>
        </>
    );
}

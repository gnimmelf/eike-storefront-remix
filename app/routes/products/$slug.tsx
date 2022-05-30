import {
    DataFunctionArgs,
    MetaFunction,
    json,
} from '@remix-run/server-runtime';
import { useState, useEffect } from 'react';
import { getProductBySlug } from '~/providers/products/products';
import {
    ShouldReloadFunction,
    useCatch,
    useLoaderData,
    useOutletContext,
} from '@remix-run/react';
import { PhotographIcon } from '@heroicons/react/solid';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { APP_META_TITLE } from '~/constants';
import { CartLoaderData } from '~/routes/api/active-order';
import { FetcherWithComponents } from '~/types';
import { sessionStorage } from '~/sessions';
import { ErrorCode, ErrorResult } from '~/generated/graphql';
import Alert from '~/components/Alert';
import { AssetPicker } from '~/components/products/AssetPicker';
import { VariantCartControls } from '~/components/products/VariantCartControls';

export type ProductLoaderData = {
    product: Awaited<ReturnType<typeof getProductBySlug>>['product'];
    error?: ErrorResult;
};

export const meta: MetaFunction = ({ data }) => {
    return {
        title: data?.product?.name
            ? `${data.product.name} - ${APP_META_TITLE}`
            : APP_META_TITLE,
    };
};

export async function loader({ params, request }: DataFunctionArgs) {
    const { product } = await getProductBySlug(params.slug!, { request });
    if (!product) {
        throw new Response('Not Found', {
            status: 404,
        });
    }
    const session = await sessionStorage.getSession(
        request?.headers.get('Cookie'),
    );
    const error = session.get('activeOrderError');
    return json(
        { product: product!, error },
        {
            headers: {
                'Set-Cookie': await sessionStorage.commitSession(session),
            },
        },
    );
}

export const unstable_shouldReload: ShouldReloadFunction = () => true;

export default function ProductSlug() {
    const { product, error } = useLoaderData<ProductLoaderData>();
    const caught = useCatch();
    const { activeOrderFetcher } = useOutletContext<{
        activeOrderFetcher: FetcherWithComponents<CartLoaderData>;
    }>();
    const { activeOrder } = activeOrderFetcher.data ?? {};
    const addItemToOrderError = getAddItemToOrderError(error);

    if (!product) {
        return <div>Product not found!</div>;
    }

    const [selectedVariant, _setSelectedVariant] = useState(null);
    const [selectedAsset, setSelectedAsset] = useState(product.featuredAsset);

    function setSelectedVariantById(selectedVariantId) {
        const variantId = selectedVariantId ?? product.variants[0].id;
        const variant = product.variants.find(({ id }) => id === variantId);
        _setSelectedVariant(variant);
        if (variant?.assets?.length) {
            setSelectedAsset(variant.assets[0]);
        }
    }

    useEffect(() => {
        if (product.variants.length === 1) {
            setSelectedVariantById(product.variants[0].id);
        }
    }, []);

    const qtyInCart =
        activeOrder?.lines.find(
            (l) => l.productVariant.id === selectedVariant?.id,
        )?.quantity ?? 0;

    const brandName = product.facetValues.find(
        (fv) => fv.facet.code === 'brand',
    )?.name;

    return (
        <div>
            <div className="max-w-6xl mx-auto px-4 text-brand-pohutukawa">
                <h2 className="text-3xl sm:text-5xl font-light tracking-tight my-8">
                    {product.name}
                </h2>

                <Breadcrumbs
                    items={
                        product.collections[product.collections.length - 1]
                            ?.breadcrumbs ?? []
                    }
                ></Breadcrumbs>

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-8">
                    {/* Image gallery */}
                    <div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                        <span className="overflow-hidden">
                            <div className="w-full h-full object-center object-cover aspect-square">
                                <img
                                    src={selectedAsset?.preview + '?w=800'}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover rounded-lg"
                                />
                            </div>
                        </span>
                        <AssetPicker
                            assets={product.assets}
                            setSelectedAsset={setSelectedAsset}
                            selectedAssetId={selectedAsset.id}
                        />
                    </div>

                    {/* Product info */}
                    <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                        <div className="">
                            <h3 className="sr-only">Description</h3>

                            <div
                                className="text-base"
                                dangerouslySetInnerHTML={{
                                    __html: product.description,
                                }}
                            />
                        </div>
                        <activeOrderFetcher.Form
                            method="post"
                            action="/api/active-order"
                        >
                            <input
                                type="hidden"
                                name="action"
                                value="addItemToOrder"
                            />
                            {product.variants.length === 1 ? (
                                <input
                                    type="hidden"
                                    name="variantId"
                                    value={selectedVariant?.id ?? null}
                                ></input>
                            ) : (
                                <div className="mt-4">
                                    <label
                                        htmlFor="option"
                                        className="block text-md font-bold"
                                    >
                                        Velg variant
                                    </label>
                                    <select
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-700 focus:border-primary-700 sm:text-sm rounded-md"
                                        id="productVariant"
                                        value={selectedVariant?.id || '--'}
                                        name="variantId"
                                        onChange={(e) => {
                                            setSelectedVariantById(
                                                e.target.value,
                                            );
                                        }}
                                    >
                                        <option key="--" value="--">
                                            {'--'}
                                        </option>
                                        {product.variants.map((variant) => (
                                            <option
                                                key={variant.id}
                                                value={variant.id}
                                            >
                                                {variant.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="mt-4">
                                <AssetPicker
                                    assets={selectedVariant?.assets}
                                    setSelectedAsset={setSelectedAsset}
                                    selectedAssetId={selectedAsset?.id}
                                />
                            </div>

                            <div className="mt-4">
                                <VariantCartControls
                                    transition={activeOrderFetcher}
                                    variant={selectedVariant}
                                    qtyInCart={qtyInCart}
                                />
                            </div>

                            {addItemToOrderError && (
                                <div className="mt-4">
                                    <Alert message={addItemToOrderError} />
                                </div>
                            )}
                        </activeOrderFetcher.Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CatchBoundary() {
    return (
        <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-gray-900 my-8">
                Product not found!
            </h2>
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
                {/* Image gallery */}
                <div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                    <span className="rounded-md overflow-hidden">
                        <div className="w-full h-96 bg-slate-200 rounded-lg flex content-center justify-center">
                            <PhotographIcon className="w-48 text-white"></PhotographIcon>
                        </div>
                    </span>
                </div>

                {/* Product info */}
                <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                    <div className="">
                        We couldn't find any product at that address!
                    </div>
                    <div className="flex-1 space-y-3 py-1">
                        <div className="h-2 bg-slate-200 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function getAddItemToOrderError(error?: ErrorResult): string | undefined {
    if (!error || !error.errorCode) {
        return undefined;
    }
    switch (error.errorCode) {
        case ErrorCode.OrderModificationError:
        case ErrorCode.OrderLimitError:
        case ErrorCode.NegativeQuantityError:
        case ErrorCode.InsufficientStockError:
            return error.message;
    }
}

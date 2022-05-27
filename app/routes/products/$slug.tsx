import {
    DataFunctionArgs,
    MetaFunction,
    json,
} from '@remix-run/server-runtime';
import { useState } from 'react';
import { Price } from '~/components/products/Price';
import { getProductBySlug } from '~/providers/products/products';
import {
    ShouldReloadFunction,
    useCatch,
    useLoaderData,
    useOutletContext,
    useTransition,
} from '@remix-run/react';
import { CheckIcon, HeartIcon, PhotographIcon } from '@heroicons/react/solid';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { APP_META_TITLE } from '~/constants';
import { CartLoaderData } from '~/routes/api/active-order';
import { FetcherWithComponents } from '~/types';
import { sessionStorage } from '~/sessions';
import { ErrorCode, ErrorResult } from '~/generated/graphql';
import Alert from '~/components/Alert';
import { StockLevelLabel } from '~/components/products/StockLevelLabel';
import { AssetPicker } from '~/components/products/AssetPicker';

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

    const [selectedVariantId, setSelectedVariantId] = useState(
        product.variants[0].id,
    );

    const [selectedAsset, setSelectedAsset] = useState(product.featuredAsset);

    const transition = useTransition();
    const selectedVariant = product.variants.find(
        (v) => v.id === selectedVariantId,
    );

    if (!selectedVariant) {
        setSelectedVariantId(product.variants[0].id);
    }
    const qtyInCart =
        activeOrder?.lines.find(
            (l) => l.productVariant.id === selectedVariantId,
        )?.quantity ?? 0;

    const asset = product.assets[0];
    const brandName = product.facetValues.find(
        (fv) => fv.facet.code === 'brand',
    )?.name;

    console.log('ProductSlug', { product, selectedAsset });

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

                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start mt-4 md:mt-12">
                    {/* Image gallery */}
                    <div className="w-full max-w-2xl mx-auto sm:block lg:max-w-none">
                        <AssetPicker
                            assets={product.assets}
                            setSelectedAsset={setSelectedAsset}
                            selectedAssetId={selectedAsset.id}
                        />
                        <span className="overflow-hidden">
                            <div className="w-full h-full object-center object-cover aspect-square">
                                <img
                                    src={selectedAsset?.preview + '?w=800'}
                                    alt={product.name}
                                    className="w-full h-full object-center object-cover"
                                />
                            </div>
                        </span>
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
                            {1 < product.variants.length ? (
                                <div className="mt-4">
                                    <label
                                        htmlFor="option"
                                        className="block text-sm font-medium"
                                    >
                                        Select option
                                    </label>
                                    <select
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                                        id="productVariant"
                                        value={selectedVariantId}
                                        name="variantId"
                                        onChange={(e) => {
                                            setSelectedAsset(
                                                product.featuredAsset,
                                            );
                                            setSelectedVariantId(
                                                e.target.value,
                                            );
                                        }}
                                    >
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
                            ) : (
                                <input
                                    type="hidden"
                                    name="variantId"
                                    value={selectedVariantId}
                                ></input>
                            )}

                            <div className="mt-10 sm:flex-row sm:items-center">
                                <AssetPicker
                                    assets={selectedVariant.assets}
                                    setSelectedAsset={setSelectedAsset}
                                    selectedAssetId={selectedAsset.id}
                                />
                            </div>

                            <div className="mt-10 flex flex-col sm:flex-row sm:items-center">
                                <p className="text-3xl text-gray-900 mr-4">
                                    <Price
                                        priceWithTax={
                                            selectedVariant?.priceWithTax
                                        }
                                        currencyCode={
                                            selectedVariant?.currencyCode
                                        }
                                    ></Price>
                                </p>
                                <div className="flex sm:flex-col1 align-baseline">
                                    <button
                                        type="submit"
                                        className={`max-w-xs flex-1 ${
                                            transition.state !== 'idle'
                                                ? 'bg-gray-400'
                                                : qtyInCart === 0
                                                ? 'bg-primary-600 hover:bg-primary-700'
                                                : 'bg-green-600 active:bg-green-700 hover:bg-green-700'
                                        } transition-colors border border-transparent rounded-md py-3 px-8 flex items-center
                                        justify-center text-base font-medium text-white focus:outline-none
                                        focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary-500 sm:w-full`}
                                        disabled={transition.state !== 'idle'}
                                    >
                                        {qtyInCart ? (
                                            <span className="flex items-center">
                                                <CheckIcon className="w-5 h-5 mr-1" />{' '}
                                                {qtyInCart} in cart
                                            </span>
                                        ) : (
                                            `Add to cart`
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 flex items-center space-x-2">
                                <span className="text-gray-500">
                                    {selectedVariant?.sku}
                                </span>
                                <StockLevelLabel
                                    stockLevel={selectedVariant?.stockLevel}
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

import React from 'react';
import { CheckIcon } from '@heroicons/react/solid';

import { Price } from '~/components/products/Price';
import { StockLevelLabel } from '~/components/products/StockLevelLabel';

const VariantCartControls = ({ variant, qtyInCart, transition }) => {
    return variant ? (
        <>
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center">
                <p className="text-3xl text-gray-900 mr-4">
                    <Price
                        priceWithTax={variant?.priceWithTax}
                        currencyCode={variant?.currencyCode}
                    />
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
            {variant && (
                <div className="mt-2 flex items-center space-x-2">
                    <span className="text-gray-500">{variant?.sku}</span>
                    <StockLevelLabel stockLevel={variant?.stockLevel} />
                </div>
            )}
        </>
    ) : null;
};

export { VariantCartControls };

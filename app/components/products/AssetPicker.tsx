import React from 'react';

const AssetPicker = ({
    altPrefix,
    assets,
    setSelectedAsset,
    selectedAssetId,
    assetPixelHeight = 70,
}) => {
    const assetBoxStyle = {
        height: `${assetPixelHeight}px`,
        width: `${assetPixelHeight}px`,
    };
    return (
        <div className="relative w-full flex gap-6 snap-x snap-mandatory overflow-x-auto py-2">
            {assets.map((asset) => {
                const { id, preview } = asset;
                const key = `${altPrefix}-${id}`;
                return (
                    <span
                        onClick={() => setSelectedAsset(asset)}
                        className={[
                            'cursor-pointer',
                            'snap-center shrink-0',
                            'border-4',
                            'overflow-hidden rounded-lg',
                            selectedAssetId === id
                                ? 'border-primary-700'
                                : 'border-brand-harvest',
                        ].join(' ')}
                        key={key}
                    >
                        <img
                            style={assetBoxStyle}
                            alt={key}
                            src={preview + `?h=${assetPixelHeight}`}
                            className="object-center object-cover"
                        />
                    </span>
                );
            })}
        </div>
    );
};

export { AssetPicker };

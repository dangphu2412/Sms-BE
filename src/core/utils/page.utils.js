import { Pageable, PageableMeta } from 'packages/restBuilder/core/pageable';

export function toPageData(reqTransformed, content, total) {
    return Pageable.of(content)
        .addMeta(
            PageableMeta
                .builder(reqTransformed, total)
                .build()
        )
        .build();
}

export function toPageDataWith(content, total, page, size) {
    return Pageable.of(content)
        .addMeta(
            PageableMeta
                .with(page, size, total)
                .build()
        )
        .build();
}

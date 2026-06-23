<?php

namespace App\Modules\Admin\Support;

final class ListQueryParams
{
    /**
     * @param  array<string, mixed>  $filters
     * @param  list<string>  $includes
     */
    public function __construct(
        public int $page = 1,
        public int $perPage = 15,
        public ?string $sort = null,
        public string $order = 'desc',
        public ?string $search = null,
        public array $filters = [],
        public array $includes = [],
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        $includes = [];

        if (! empty($data['include'])) {
            $includes = array_values(array_filter(array_map(
                trim(...),
                explode(',', (string) $data['include'])
            )));
        }

        return new self(
            page: max(1, (int) ($data['page'] ?? 1)),
            perPage: min(100, max(1, (int) ($data['per_page'] ?? 15))),
            sort: isset($data['sort']) ? (string) $data['sort'] : null,
            order: ($data['order'] ?? 'desc') === 'asc' ? 'asc' : 'desc',
            search: isset($data['search']) ? (string) $data['search'] : null,
            filters: (array) ($data['filter'] ?? []),
            includes: $includes,
        );
    }
}

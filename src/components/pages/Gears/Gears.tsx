import {useQuery, useQueryClient} from "react-query";
import {getFromServer} from "../../../services/server";
import {Header, StyledGears, ColumnHeader, Bulker, StyledButton as Button} from "./styles";
import Gear from "../../molecules/Gear/Gear";
import {Gear as GearType} from "../../../types/Gear";
import Filters from "../../molecules/Filters/Filters"
import {Filters as FiltersType} from "./types"
import {ChangeEvent, useContext, useState} from "react";
import {FilterContext} from "../../../contexts/FilterContext";
import {bulkUpdate, BulkUpdateParameters, getBulkUpdateParametersPropertyNames} from "../../../services/gears";

const initialFilters: FiltersType = {
    craft: "off"
}

type CraftsQuery = {
    gears: GearType[],
    remaining: number,
}

export default function Gears() {
    const [frontFilters, setFrontFilters] = useState(initialFilters as FiltersType);
    const queryClient = useQueryClient();
    const {filters} = useContext(FilterContext);
    const types = filters.types?.toString();

    const {data, isLoading} = useQuery<CraftsQuery>(['gears', {
        ...filters,
        types,
    }], fetchGears)

    const gears = data?.gears || [];
    const remaining = data?.remaining || 0

    return (
        <div>
            <Filters isGearsPage={true}/>
            <p>({remaining} Restants)</p>
            <StyledGears>
                <Header>
                    <span>Image</span>
                    <span>Nom</span>
                    <span>Niveau</span>
                    <span>Vendus</span>
                    <span>En vente</span>
                    <span>Possédé</span>
                    <span>Racheter</span>
                    <span>Wish List</span>
                    <span>Prix</span>
                    <ColumnHeader onClick={() => toggleFilter('craft')}>
                        Craft
                        {frontFilters.craft === 'asc' ? ' ^' : frontFilters.craft === 'desc' ? ' v' : ''}
                    </ColumnHeader>
                    <span>Ratio</span>
                    <span>Recette</span>
                </Header>
                <Bulker>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <input type="checkbox" onChange={onBulkUpdateChange} name='isInMarket'/>
                    <input type="checkbox" onChange={onBulkUpdateChange} name='isInInventory'/>
                    <span>
                        <Button onClick={() => bulkUpdateField('toBeCrafted', 0)}>0</Button>
                        <Button onClick={() => bulkUpdateField('toBeCrafted', 1)}>1</Button>
                    </span>
                    <span>
                        <Button onClick={() => bulkUpdateField('onWishList', 0)}>0</Button>
                        <Button onClick={() => bulkUpdateField('onWishList', 1)}>1</Button>
                    </span>
                </Bulker>
                {isLoading ? <p>ça charge les cocos</p> :
                    sortedGears().map((gear) => (
                            <Gear key={Object.values(gear).join('')} data={gear} afterUpdate={refetch}/>
                        )
                    )
                }
            </StyledGears>
        </div>
    )

    /**
     * Update the given field to the desired amount
     * @param field
     * @param amount
     */
    function bulkUpdateField(field: string, amount: 0 | 1) {
        if (getBulkUpdateParametersPropertyNames().includes(field)) {
            const parameters: BulkUpdateParameters = {[field]: amount}
            bulkUpdate(gears.map(({_id}) => _id), parameters).then(refetch)
        }
    }

    function toggleFilter(filter: keyof typeof frontFilters) {

        const currentValue = frontFilters[filter];

        setFrontFilters({
            [filter]: newFilterValue(filter, currentValue)
        })
    }

    function newFilterValue(filter: keyof typeof frontFilters, value: 'off' | 'asc' | 'desc') {
        switch (value) {
            case "off":
                return 'asc';
            case 'asc':
                return 'desc';
            case 'desc':
            default:
                return 'off';
        }
    }

    /**
     * Sort by benefit and wanted status
     *
     * Priority :
     * toBeCrafted > Wished > Benefit
     *
     * < 0 => A->B
     * > 0 => B-> A
     */
    function sortedGears() {
        return gears.sort((gear1, gear2) => {

            if (frontFilters.craft === 'asc') {
                return gear2.craftingPrice - gear1.craftingPrice;
            }

            if (frontFilters.craft === 'desc') {
                return gear1.craftingPrice - gear2.craftingPrice;
            }

            return 1;
        })
    }

    /**
     * Update all the displayed crafts [name] value at the same time
     * @param event
     */
    function onBulkUpdateChange(event: ChangeEvent<HTMLInputElement>) {
        if (getBulkUpdateParametersPropertyNames().includes(event.target.name)) {
            const parameters: BulkUpdateParameters = {[event.target.name]: event.target.checked}
            bulkUpdate(gears.map(({_id}) => _id), parameters).then(refetch)
        }
    }

    function refetch() {
        queryClient.invalidateQueries('gears');
    }

    function fetchGears({queryKey}: any) {
        const [key, params] = queryKey;
        const search = encodeURIComponent(params.search);
        return getFromServer('/gears', {
            ...params,
            search,
        })
            .then(response => response.data)
    }
}

export interface Acnh_data_interface {
    type: number,
    name: string,
    icon: string,
    weather: number,
    month: {
        north: number[],
        south: number[],
    },
    time_of_day: number[],
    totalCatches: number,

    bugLocation?: string,
    fishLocation?: string,

    seaCreatureShadowSize?: string,
    seaCreatureShadowMoveMent?: string,
}
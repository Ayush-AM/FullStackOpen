declare const diagnoses: ({
    code: string;
    name: string;
    latin: string;
} | {
    code: string;
    name: string;
    latin?: undefined;
})[];
export default diagnoses;

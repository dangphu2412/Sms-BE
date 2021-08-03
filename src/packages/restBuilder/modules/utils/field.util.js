export class FieldUtils {
    static buildMonth(field) {
        return {
            $month: `$${field}`,
        };
    }

    static buildYear(field) {
        return {
            $year: `${field}`
        };
    }
}

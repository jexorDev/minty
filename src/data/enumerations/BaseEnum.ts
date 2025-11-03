export default abstract class BaseEnum {
   public getItems(): EnumItem[] {    
        const items: EnumItem[] = [];    
        const values = Object.values(this);
        for (var i = 0; i < values.length; i++) {
            items.push(values[i]);
        }
        return items;
   }

   public getItemByValue(value: number): EnumItem | undefined{
    return this.getItems().find(x => x.value === value);
   } 

}

export interface EnumItem {
    value: number;
    description: string;
}


export const paraVaule2Map = (paraStr: string) => {
    let valueMap = new Map();
    if(paraStr===undefined)return valueMap;
    paraStr.split(";").forEach(s => {
        if (s.length !== 0) {
            let kv = s.split("=");
            valueMap.set(kv[0], Number(kv[1]));
        }
    })
    return valueMap;
}
export const paraVaule2Str = (paraMap: Map<string, number>) => {
    let valueStr = "";

    paraMap.forEach((value, key) => {
        valueStr += key + "=" + value + ";"
    })
    return valueStr;
}
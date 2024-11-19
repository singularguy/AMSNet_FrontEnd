interface CircuitNode {
    node: string;
    properties: {
        name: string;
        load: string;
        low: string;
        input: string;
        output: string;
        class: string;
        evaluates: string;
        sets: string;
        DM_Gain: string;
        CMRR: string;
        PSRR: string;
        CM_gain: string;
    };
}

// 表示非原始节点 是解析出来的
interface ParsedNode {
    node: string;
    properties: {
        name: string
    }
}

// 定义链路数据的接口类型
interface Link {
    source: string;
    target: string;
    label: string;
    properties: {
        description: string;
    };
}

// 表示非原始链路 是解析出来的
interface ParsedLink {
    source: string;
    target: string;
    label: string;
    properties: {
        description: string;
    };
}

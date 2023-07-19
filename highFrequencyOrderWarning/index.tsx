import * as React from "react";
import * as qs from "query-string";
import {
    Tabs,
    Badge,
    Button,
    Flex,
    Modal,
    ImagePicker,
    Toast,
} from "antd-mobile";
import * as styles from "./index.scss";
import Card from './components/Card'
import * as api from "../../services/highFrequencyOrderWarning";
import * as moment from "moment";

const { useState, useEffect, useCallback } = React;

export default React.memo(() => {
    const searchParams = qs.parse(window.location.search);
    const { msgid } = searchParams;
    const [data, setData] = useState([])
    document.title = '高频提交订单预警';

    useEffect(() => {
        fetchData(msgid)

    }, [])

    const dataFormat = (data) => {
        const data1 = [];
        const data2 = [];
        data.forEach((item => {
            if(item.detailList[0].is_check){
                data1.push(item)
            }else{
                data2.push(item)
            }
        }))

        data2.sort(function(a,b){return b.detailList[0].order_submit_time - a.detailList[0].order_submit_time})

        return [...data2, ...data1]
    }

    const fetchData = (msgid) => {
        // setLoading(true);
        api.getAllWarnData({ msgid }, true).then((res: any) => {
            if (res) {
                setData(dataFormat(res))
            }
        });
    };
    return (
        <div className={styles.p_hfow}>
            {
                data.map(item => <Card data={item} key={item.msgid} noBtn={true}></Card>)
            }
        </div>
    )


})

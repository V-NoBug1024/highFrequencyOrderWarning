import * as React from "react";
import * as styles from './index.scss';
import {Modal, PickerView, DatePickerView, Icon} from "antd-mobile";
import * as moment from "moment";
import BroswerHistory from "@utils/history";


interface IProps {
    data: any,
    noBtn: boolean,
}

const { useState, useEffect } = React
export default React.memo((props: IProps) => {
    const {data, noBtn} = props

    const goToDetails = (msgid) => {
        BroswerHistory.push({
            pathname: `/high-frequency-order-warning/details`,
            search: `?msgid=${msgid}`
        });
    }


    return (
        <div className={styles.c_card}>
            <div className='tit'>
                {data.detailList[0] && data.detailList[0].is_check === '' && <span className={styles.tit_icon}></span>}
                紧急：【超市到家】高频提交订单预警，请及时关注是否活动设置异常
            </div>
            <div className='member'>会员账号：{data.member_id}</div>
            <div className='list_wrap'>
                {
                    data.detailList && data.detailList.map(item => (
                        <div className='list' key={item.order_id}>
                            <div className='list_tit'>{item.plant_name}-{item.order_id}</div>
                            <div className='list_text'>{moment(item.order_submit_time/1000).format("YYYY-MM-DD HH:mm:ss")}</div>
                        </div>
                    ))
                }
                {data.detailList[0] && data.detailList[0].is_check !== '' && <div className={styles.processed}></div>}
            </div>

            {noBtn === true && <div className='btn' onClick={() => goToDetails(data.msgid)}>{data.detailList[0] && data.detailList[0].is_check === '' ? '立即处理' : '查看详情'}<Icon style={{ color: "#ccc",position: "absolute",right: 0,top: '10px' }} type="right" /></div>}
        </div>
    );
})
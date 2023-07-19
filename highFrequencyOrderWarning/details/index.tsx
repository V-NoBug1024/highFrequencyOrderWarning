import * as React from "react";
import * as qs from "query-string";
import {
    Tabs,
    Badge,
    Button,
    Flex,
    Modal,
    ImagePicker,
    Toast, TextareaItem,
} from "antd-mobile";
import * as styles from "./index.scss";
import Card from '../components/Card'
import * as api from "../../../services/highFrequencyOrderWarning";
import * as moment from "moment";
import BroswerHistory from "@utils/history";

const { useState, useEffect, useCallback } = React;

export default React.memo(() => {
    const searchParams = qs.parse(window.location.search);
    const { msgid } = searchParams;
    const [data, setData] = useState({member_id:'',detailList: []})
    const [textarea, setTextarea] = useState();
    const [isCheck, setIsCheck] = useState('');
    const [dis, setDis] = useState(true);
    const [isChecked, setIsChecked] = useState(false)
    // const []
    document.title = '高频提交订单预警';

    useEffect(() => {
        fetchData(msgid)

    }, [])

    const fetchData = (msgid) => {
        // setLoading(true);
        api.getWarnData({ msgid }, true).then((res: any) => {
            if (res) {
                const {is_check, check_msg} = res.detailList[0];
                if(is_check !== '') {
                    setIsCheck(is_check)
                    setIsChecked(true)
                    setTextarea(check_msg)
                }
                setData(res)
            }
        });
    };

    const onTextareaChange = (value) => {
        setTextarea(value)
    }

    const checkHandle = (type) => {
        if(dis === true) {
            setDis(false)
        }
        setIsCheck(type)
    }

    const btnChange = () => {
        const params = {
            msgid,
            member_id: data.member_id,
            check_empl_id: localStorage.getItem("userId") || '142464',
            check_msg: textarea,
            is_check: isCheck,
        }

        api.submitResult({...params}, true).then((res:any) => {
            Toast.success('提交成功', 1, () => {
                BroswerHistory.goBack()
            })
        })

    }

    return (
        <div className={styles.p_hfow_d}>
            <Card data={data} noBtn={false}></Card>
            <div className={styles.operat}>
                是否为正常消费
                <div className={styles.btn_wrap}>
                    {!isChecked ? (
                        <>
                            <div className={`${styles.btn} ${isCheck === '0' ? styles.checked : ''}`} onClick={() => checkHandle('0')}>正常</div>
                            <div className={`${styles.btn} ${isCheck === '1' ? styles.checked : ''}`} onClick={() => checkHandle('1')}>不正常</div>
                        </>

                    ) :
                        isCheck === '0' ? (
                                <div className={`${styles.btn} ${styles.checked}`} >正常</div>
                        )
                            :

                        (
                            <div className={`${styles.btn} ${styles.checked}`} >不正常</div>
                        )}

                </div>
                <div className={styles.ps}>
                    <div className={styles.ps_tit}>备注</div>
                    <TextareaItem
                        value={textarea}
                        disabled={isChecked}
                        className="stock-textarea"
                        placeholder="请输入超标原因/处理方式"
                        rows={5}
                        count={100}
                        onChange={onTextareaChange}
                    />
                </div>
            </div>
            {!isChecked && <Button type="primary" disabled={dis} style={{margin: '30px 15px',borderRadius: '50px'}} onClick={btnChange}>提交</Button>}
        </div>
    )


})
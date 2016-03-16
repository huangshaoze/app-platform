package cn.com.yitong.interface_platform;

import java.text.DecimalFormat;

/**
 * @author zhuzengpeng<zzp@yitong.com.cn>
 */
//微信红包算法测试
public class TestHongBao1 {
	static double totalMoney = 10000;//红包总金额
    static double outMoney = 0.00;//已经发送的金额
    public static void main(String[] args){
        int totalPeople = 1000;//抢红包总人数
        double minMoney = 10;//每个人至少分得的钱数
        double lastMoney = 0.00;//最后一个人获得的金额
        double originMoney = totalMoney;
        DecimalFormat df = new DecimalFormat("0.00");
        for(int i = 0; i < totalPeople-1; i++){
            int j = i+1;
            double safeMoney = (totalMoney-(totalPeople-j)*minMoney)/(totalPeople-j);
            double tempMoney = (Math.random()*(safeMoney*100-minMoney*100)+minMoney*100)/100;
            totalMoney -= tempMoney;
            System.out.format("第%d个人分得红包，金额为：%.2f\n", j, tempMoney);
            outMoney += tempMoney;
        }
        lastMoney = originMoney - outMoney;
        if(lastMoney + outMoney > originMoney){
            double temp = lastMoney + outMoney - originMoney;
            lastMoney -= temp;
        }
    }
}

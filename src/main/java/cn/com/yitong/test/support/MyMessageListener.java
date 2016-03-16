package cn.com.yitong.test.support;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;

/**
 * Created by zhuzengpeng on 2016/2/25.
 */
public class MyMessageListener implements MessageListener {

    @Override
    public void onMessage(Message message, byte[] pattern) {
        System.out.println("channel:" + new String(message.getChannel())
                + ",message:" + new String(message.getBody()) + ",pattern:"+new String(pattern));
    }
}

package cn.com.yitong.test.activemq;

import org.springframework.jms.core.JmsTemplate;

import javax.jms.*;

/**
 * Created by zhuzengpeng on 2016/3/29.
 */
public class ConsumerMessageListener implements MessageListener {

    @Override
    public void onMessage(Message message) {
        //这里我们知道生产者发送的就是一个纯文本消息，所以这里可以直接进行强制转换
        TextMessage textMsg = (TextMessage) message;
        try {
            System.out.println("接收到消息：" + textMsg.getText());
        } catch (JMSException e) {
            e.printStackTrace();
        }
    }
}

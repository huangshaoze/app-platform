package cn.com.yitong.test.support;

import redis.clients.jedis.JedisPubSub;

/**
 * Created by zhuzengpeng on 2016/2/25.
 */
public class KeyExpiredListener extends JedisPubSub {

    @Override
    public void onPSubscribe(String pattern, int subscribedChannels) {
        System.out.println("onPSubscribe "
                + pattern + " " + subscribedChannels);
    }

    @Override
    public void onPMessage(String pattern, String channel, String message) {

        System.out
                .println("onPMessage pattern "
                        + pattern + " " + channel + " " + message);
    }

}

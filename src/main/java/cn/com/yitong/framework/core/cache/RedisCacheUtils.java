package cn.com.yitong.framework.core.cache;

import cn.com.yitong.framework.core.spring.SpringApplicationContextHolder;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;

/**
 * REDIS缓存操作工具类
 * Created by zhuzengpeng on 2016/3/7.
 */
public class RedisCacheUtils {

    private static StringRedisTemplate redisTemplate = SpringApplicationContextHolder.getBean(StringRedisTemplate.class);

    /**
     * 从REDIS缓存中取出数据
     * @param key
     * @return
     */
    public static String get(final String key) {
        return redisTemplate.execute(new RedisCallback<String>() {
            @Override
            public String doInRedis(RedisConnection connection)
                    throws DataAccessException {
                byte[] keybyte = redisTemplate.getStringSerializer().serialize(key);
                if (connection.exists(keybyte)) {
                    byte[] value = connection.get(keybyte);
                    String retvalue = redisTemplate.getStringSerializer().deserialize(value);
                    return retvalue;
                }
                return null;
            }
        });
    }

    /**
     * 往REDIS中放入值
     * @param key
     * @param value
     */
    public static void set(final String key, final String value) {
        redisTemplate.execute(new RedisCallback<Object>() {
            @Override
            public Object doInRedis(RedisConnection connection) throws DataAccessException {
                connection.set(
                        redisTemplate.getStringSerializer().serialize(key),
                        redisTemplate.getStringSerializer().serialize(value));
                return null;
            }
        });
    }

    /**
     * 清除REDIS值
     * @param key
     */
    public static void evict(String key) {
        redisTemplate.delete(key);
    }
}

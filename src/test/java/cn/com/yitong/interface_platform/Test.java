package cn.com.yitong.interface_platform;

import java.util.UUID;

import com.alibaba.druid.sql.PagerUtils;
import com.alibaba.druid.support.json.JSONUtils;
import com.alibaba.druid.util.JdbcUtils;

import cn.com.yitong.framework.common.uuid.RandomUniqueIdGenerator;

/**
 * @author zhuzengpeng<zzp@yitong.com.cn>
 * @date 2015-4-21 上午8:48:46
 */
public class Test {

	public static void main(String[] args) {
		String msgId = "000" + System.currentTimeMillis();
		System.out.println(msgId);
		String uuid = UUID.randomUUID().toString();
		System.out.println(uuid);
	}
}

package cn.com.yitong.framework.core.support.mybatis;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author zhuzengpeng<zzp@yitong.com.cn>
 * @date 2015-4-15 上午10:31:17
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyBatisRepository {

}

package cn.com.yitong.framework.common.dao.jdbc.support;

import com.alibaba.druid.sql.PagerUtils;
import com.alibaba.druid.sql.ast.statement.SQLSelect;
import com.alibaba.druid.sql.ast.statement.SQLSelectQueryBlock;
import com.alibaba.druid.sql.dialect.db2.ast.stmt.DB2SelectQueryBlock;
import com.alibaba.druid.sql.dialect.mysql.ast.statement.MySqlSelectQueryBlock;
import com.alibaba.druid.util.JdbcConstants;

/**
 * @author zhuzengpeng
 * @date 2013-7-25 下午4:36:40
 */
public class Db2SqlBuilder extends AbstractSqlBuilder{

	@Override
	public String innerLimitSql(SQLSelect select, int offset, int count) {
		return PagerUtils.limit(select, this.getDbType(), offset, count);
	}

	@Override
	protected String getDbType() {
		return JdbcConstants.DB2;
	}

	@Override
	protected SQLSelectQueryBlock createQueryBlock() {
		return new DB2SelectQueryBlock();		
	}

}

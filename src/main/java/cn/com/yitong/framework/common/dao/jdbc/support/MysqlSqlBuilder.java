package cn.com.yitong.framework.common.dao.jdbc.support;

import com.alibaba.druid.sql.SQLUtils;
import com.alibaba.druid.sql.ast.expr.SQLNumberExpr;
import com.alibaba.druid.sql.ast.statement.SQLSelect;
import com.alibaba.druid.sql.ast.statement.SQLSelectQueryBlock;
import com.alibaba.druid.sql.dialect.mysql.ast.statement.MySqlSelectQueryBlock;
import com.alibaba.druid.sql.dialect.mysql.ast.statement.MySqlSelectQueryBlock.Limit;
import com.alibaba.druid.util.JdbcConstants;

/**
 * @author bsli@ustcinfo.com
 * @date 2013-2-3 下午2:20:46
 */
public class MysqlSqlBuilder extends AbstractSqlBuilder {

	@Override
	public String innerLimitSql(SQLSelect select, int offset, int count) {
		MySqlSelectQueryBlock queryBlock = (MySqlSelectQueryBlock) select.getQuery();
		if (queryBlock.getLimit() != null) {
            throw new IllegalArgumentException("limit already exists.");
        }

        Limit limit = new Limit();
        if (offset > 0) {
            limit.setOffset(new SQLNumberExpr(offset));
        }
        limit.setRowCount(new SQLNumberExpr(count));
        queryBlock.setLimit(limit);

        return SQLUtils.toSQLString(queryBlock, this.getDbType());
	}
	
	@Override
	protected String getDbType() {
		return JdbcConstants.MYSQL;
	}
	
	@Override
	protected SQLSelectQueryBlock createQueryBlock() {
		return new MySqlSelectQueryBlock();
	}
	
}

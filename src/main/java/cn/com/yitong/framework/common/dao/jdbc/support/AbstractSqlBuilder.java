package cn.com.yitong.framework.common.dao.jdbc.support;

import java.util.List;

import cn.com.yitong.framework.common.dao.jdbc.SqlBuilder;

import com.alibaba.druid.sql.SQLUtils;
import com.alibaba.druid.sql.ast.SQLStatement;
import com.alibaba.druid.sql.ast.expr.SQLAggregateExpr;
import com.alibaba.druid.sql.ast.expr.SQLAllColumnExpr;
import com.alibaba.druid.sql.ast.statement.SQLSelect;
import com.alibaba.druid.sql.ast.statement.SQLSelectItem;
import com.alibaba.druid.sql.ast.statement.SQLSelectQuery;
import com.alibaba.druid.sql.ast.statement.SQLSelectQueryBlock;
import com.alibaba.druid.sql.ast.statement.SQLSelectStatement;
import com.alibaba.druid.sql.ast.statement.SQLSubqueryTableSource;
import com.alibaba.druid.sql.ast.statement.SQLUnionQuery;
import com.alibaba.druid.sql.dialect.mysql.ast.statement.MySqlSelectQueryBlock;
import com.alibaba.druid.sql.dialect.postgresql.ast.stmt.PGSelectQueryBlock;

public abstract class AbstractSqlBuilder implements SqlBuilder {
	
	@Override
	public String countSql(String sql) {
		List<SQLStatement> stmtList = SQLUtils.parseStatements(sql, this.getDbType());

        if (stmtList.size() != 1) {
            throw new IllegalArgumentException("sql not support count : " + sql);
        }

        SQLStatement stmt = stmtList.get(0);

        if (!(stmt instanceof SQLSelectStatement)) {
            throw new IllegalArgumentException("sql not support count : " + sql);
        }

        SQLSelectStatement selectStmt = (SQLSelectStatement) stmt;
        
        String result = innerCountSql(selectStmt.getSelect()).trim();
        if(result.endsWith(";"))
        	result = result.substring(0, result.length()-1);
        return result;
	}
	
	@Override
	public String limitSql(String sql, int offset, int count) {
		List<SQLStatement> stmtList = SQLUtils.parseStatements(sql, this.getDbType());

        if (stmtList.size() != 1) {
            throw new IllegalArgumentException("sql not support count : " + sql);
        }

        SQLStatement stmt = stmtList.get(0);

        if (!(stmt instanceof SQLSelectStatement)) {
            throw new IllegalArgumentException("sql not support count : " + sql);
        }

        SQLSelectStatement selectStmt = (SQLSelectStatement) stmt;

        return innerLimitSql(selectStmt.getSelect(), offset, count);
	}
	
	public abstract String innerLimitSql(SQLSelect select, int offset, int count);
	
	private String innerCountSql(SQLSelect select) {
		if (select.getOrderBy() != null) {
            select.setOrderBy(null);
        }

        SQLSelectQuery query = select.getQuery();
        clearOrderBy(query);

        if (query instanceof SQLSelectQueryBlock) {
            SQLSelectItem countItem = createCountItem();

            SQLSelectQueryBlock queryBlock = (SQLSelectQueryBlock) query;

            if (queryBlock.getGroupBy() != null && queryBlock.getGroupBy().getItems().size() > 0) {
                return createCountUseSubQuery(select);
            }

            queryBlock.getSelectList().clear();
            queryBlock.getSelectList().add(countItem);
            return SQLUtils.toSQLString(select, this.getDbType());
        } else if (query instanceof SQLUnionQuery) {
            return createCountUseSubQuery(select);
        }

        throw new IllegalStateException();
	}
	
	protected abstract String getDbType();
	
	protected SQLSelectItem createCountItem() {
        SQLAggregateExpr countExpr;

        countExpr = new SQLAggregateExpr("COUNT");
        countExpr.getArguments().add(new SQLAllColumnExpr());

        SQLSelectItem countItem = new SQLSelectItem(countExpr);
        return countItem;
    }
	
	protected String createCountUseSubQuery(SQLSelect select) {
        SQLSelectQueryBlock countSelectQuery = createQueryBlock();

        SQLSelectItem countItem = createCountItem();
        countSelectQuery.getSelectList().add(countItem);

        countSelectQuery.setFrom(new SQLSubqueryTableSource(select));

        SQLSelect countSelect = new SQLSelect();
        countSelect.setQuery(countSelectQuery);
        SQLSelectStatement countStmt = new SQLSelectStatement(countSelect);

        return SQLUtils.toSQLString(countStmt, this.getDbType());
    }
	
	protected abstract SQLSelectQueryBlock createQueryBlock();
	
	protected void clearOrderBy(SQLSelectQuery query) {
        if (query instanceof SQLSelectQueryBlock) {
            SQLSelectQueryBlock queryBlock = (SQLSelectQueryBlock) query;
            if (queryBlock instanceof MySqlSelectQueryBlock) {
                MySqlSelectQueryBlock mysqlQueryBlock = (MySqlSelectQueryBlock) queryBlock;
                if (mysqlQueryBlock.getOrderBy() != null) {
                    mysqlQueryBlock.setOrderBy(null);
                }
            } else if (queryBlock instanceof PGSelectQueryBlock) {
                PGSelectQueryBlock pgQueryBlock = (PGSelectQueryBlock) queryBlock;
                if (pgQueryBlock.getOrderBy() != null) {
                    pgQueryBlock.setOrderBy(null);
                }
            }
            return;
        }

        if (query instanceof SQLUnionQuery) {
            SQLUnionQuery union = (SQLUnionQuery) query;
            if (union.getOrderBy() != null) {
                union.setOrderBy(null);
            }
            clearOrderBy(union.getLeft());
            clearOrderBy(union.getRight());
        }
    }
	
}

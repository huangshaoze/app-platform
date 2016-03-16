package cn.com.yitong.framework.common.dao.jdbc.support;

import com.alibaba.druid.sql.SQLUtils;
import com.alibaba.druid.sql.ast.SQLExpr;
import com.alibaba.druid.sql.ast.expr.SQLAllColumnExpr;
import com.alibaba.druid.sql.ast.expr.SQLBinaryOpExpr;
import com.alibaba.druid.sql.ast.expr.SQLBinaryOperator;
import com.alibaba.druid.sql.ast.expr.SQLIdentifierExpr;
import com.alibaba.druid.sql.ast.expr.SQLNumberExpr;
import com.alibaba.druid.sql.ast.expr.SQLPropertyExpr;
import com.alibaba.druid.sql.ast.statement.SQLSelect;
import com.alibaba.druid.sql.ast.statement.SQLSelectItem;
import com.alibaba.druid.sql.ast.statement.SQLSelectQuery;
import com.alibaba.druid.sql.ast.statement.SQLSelectQueryBlock;
import com.alibaba.druid.sql.ast.statement.SQLSubqueryTableSource;
import com.alibaba.druid.sql.dialect.oracle.ast.stmt.OracleSelectQueryBlock;
import com.alibaba.druid.util.JdbcConstants;

public class OracleSqlBuilder extends AbstractSqlBuilder {

	@Override
	public String innerLimitSql(SQLSelect select, int offset, int count) {
		SQLSelectQuery query = select.getQuery();

        if (query instanceof SQLSelectQueryBlock) {
            OracleSelectQueryBlock queryBlock = (OracleSelectQueryBlock) query;
            if (queryBlock.getGroupBy() == null && select.getOrderBy() == null && offset <= 0) {
                SQLExpr condition = new SQLBinaryOpExpr(new SQLIdentifierExpr("ROWNUM"), //
                                                        SQLBinaryOperator.LessThanOrEqual, //
                                                        new SQLNumberExpr(count));
                if (queryBlock.getWhere() == null) {
                    queryBlock.setWhere(condition);
                } else {
                    queryBlock.setWhere(new SQLBinaryOpExpr(queryBlock.getWhere(), //
                                                            SQLBinaryOperator.BooleanAnd, //
                                                            condition));
                }

                return SQLUtils.toSQLString(select, this.getDbType());
            }
        }

        OracleSelectQueryBlock countQueryBlock = new OracleSelectQueryBlock();
        countQueryBlock.getSelectList().add(new SQLSelectItem(new SQLPropertyExpr(new SQLIdentifierExpr("X"), "*")));
        countQueryBlock.getSelectList().add(new SQLSelectItem(new SQLIdentifierExpr("ROWNUM"), "RN"));

        countQueryBlock.setFrom(new SQLSubqueryTableSource(select, "X"));
        countQueryBlock.setWhere(new SQLBinaryOpExpr(new SQLIdentifierExpr("ROWNUM"), //
                                                     SQLBinaryOperator.LessThanOrEqual, //
                                                     new SQLNumberExpr(count + offset)));
        if (offset <= 0) {
            return SQLUtils.toSQLString(countQueryBlock, this.getDbType());
        }

        OracleSelectQueryBlock offsetQueryBlock = new OracleSelectQueryBlock();
        offsetQueryBlock.getSelectList().add(new SQLSelectItem(new SQLAllColumnExpr()));

        SQLSelect sqlSelect = new SQLSelect();
        sqlSelect.setQuery(countQueryBlock);
        offsetQueryBlock.setFrom(new SQLSubqueryTableSource(sqlSelect, "XX"));
        offsetQueryBlock.setWhere(new SQLBinaryOpExpr(new SQLIdentifierExpr("RN"), //
                                                      SQLBinaryOperator.GreaterThan, //
                                                      new SQLNumberExpr(offset)));

        return SQLUtils.toSQLString(offsetQueryBlock, this.getDbType());
	}

	@Override
	protected String getDbType() {
		return JdbcConstants.ORACLE;
	}

	@Override
	protected SQLSelectQueryBlock createQueryBlock() {
		return new OracleSelectQueryBlock();
	}
}

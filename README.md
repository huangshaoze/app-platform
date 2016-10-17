## 内置功能
1. 加密功能：使用RSA+AES加密

## 技术选型

1、后端

* 核心框架：Spring Framework 4.0
* 视图框架：Spring MVC 4.0
* 持久层框架：MyBatis 3.2
* 数据库连接池：Alibaba Druid 1.0
* 缓存框架：simple cache、Redis
* 日志管理：SLF4J 1.7、Logback
* 工具类：Apache Commons、Jackson 2.2、Xstream 1.4、Dozer 5.3、POI 3.9

2、平台

* 服务器中间件：在Java EE 5规范（Servlet 2.5、JSP 2.1）下开发，支持应用服务器中间件
有Tomcat 6、Jboss 7、WebLogic 10、WebSphere 8。
* 数据库支持：目前仅提供MySql和Oracle数据库的支持，但不限于数据库，平台留有其它数据库支持接口，
可方便更改为其它数据库，如：SqlServer 2008、MySql 5.5、H2等
* 开发环境：Java EE、Eclipse、Maven、Git
import { Pool } from "mysql2/promise";
import OrderRepository from "@Order/infrastructure/OrderRepository";
import Order from "@Order/domain/Order";
import RepositoryErrorHandler from "@Api/Errors/RepositoryErrorHandler";
import { Logger } from "@Api/utils/logger";
import DataContext from "@Api/Contexts/Shared/infrastructure/dataContext";
import MySqlOrderDTO from "@Order/infrastructure/MySQL/DTO";

const log = Logger(__filename);

class MySQLOrderRepository implements OrderRepository {
  public async find(): Promise<Order[]> {
    try {
      const [rows]: any[] = await (DataContext.getContext() as Pool)
        .execute(`SELECT od.order_id, o.order_number, o.client_id, o.total, od.item_id, od.quantity, od.subtotal, i.sku, i.barcode, i.name, i.item_number, i.price, c.username, c.name, c.lastname, c.id_number, od.id as order_detail_id, i.name as item_name
      FROM orders as o INNER JOIN order_details as od ON (o.id = od.order_id)
      INNER JOIN items AS i ON (i.id = od.item_id)
      INNER JOIN clients AS c ON(c.id = o.client_id)`);
      const orders = MySqlOrderDTO.OrdersMapper(rows);
      return orders;
    } catch (ex: any) {
      log.error(
        "Something was wrong in MySql Order Repository when try to find the order list",
        {
          errorMessage: ex.message,
          stack: ex.stack,
        }
      );
      throw new RepositoryErrorHandler(
        `Something was wrong in MySql Order Repository when try to find the order list: message ${ex.message}`
      );
    }
  }
  public async save(order: Order): Promise<void> {
    try {
      const context:Pool = (DataContext.getContext() as Pool);
      for (const orderDetail of order.orderDetails) {
        await context.execute(
          `INSERT INTO items(id, sku, barcode, item_number, price, name) VALUES("${orderDetail.id}", "${orderDetail.item.sku}","${orderDetail.item.barcode}", "${orderDetail.item.itemNumber}", ${orderDetail.item.price}, "${orderDetail.item.name}")`
        );
        await context.execute(
          `INSERT INTO order_details(id, item_id, order_id, quantity, subtotal) VALUES(${parseInt(orderDetail.item.id)}, ${orderDetail.item.id}, 1, ${orderDetail.quantity}, ${orderDetail.subtotal})`
        );
      }
      await context.execute(
        `INSERT INTO clients(id, username, name, lastname, id_number) VALUES(1, "${order.client?.username}", "${order.client?.name}", "${order.client?.lastname}", "${order.client?.idNumber}")`
      );
      await context.execute(
        `INSERT INTO orders(id, order_number, client_id, total) VALUES(1,"${order.orderNumber}", "${order.client.id}", "${order.total}")`
      );
    }
    catch(ex: any) {
      log.error(
        "Something was wrong in MySql Order Repository when save an order",
        {
          errorMessage: ex.message,
          stack: ex.stack,
        }
      );
      throw new RepositoryErrorHandler(
        `Something was wrong in MySql Order Repository when save an order: message ${ex.message}`
      );
    }
  }
  update(id: string, order: Order): void {
    console.log(order);
    console.log(id);
    throw new Error("Method not implemented.");
  }
  delete(id: string): void {
    console.log(id);
    throw new Error("Method not implemented.");
  }
  findByOrderNumber(orderNumber: string): Promise<Order> {
    console.log(orderNumber);
    throw new Error("Method not implemented.");
  }
}

export default MySQLOrderRepository;

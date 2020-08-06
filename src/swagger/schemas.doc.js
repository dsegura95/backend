/**
 * @swagger
 *
 * components:
 *  schemas:
 *
 *    item:
 *      type: object
 *      required:
 *        - id
 *        - name
 *      properties:
 *        id:
 *          type: integer
 *          format: int32
 *        name:
 *          type: string
 *        description:
 *          type: string
 *
 *    trimester:
 *      type: object
 *      required:
 *        - id
 *      properties:
 *        id:
 *          type: string
 *          example: ENE-MAR2020
 *        start:
 *          type: date
 *        finish:
 *          type: date
 *
 *    dept:
 *      type: object
 *      required:
 *      - id
 *      properties:
 *        id:
 *          type: string
 *          example: CI
 *        name:
 *          type: string
 *
 *    subject:
 *      type: object
 *      required:
 *      - id
 *      properties:
 *        id:
 *          type: string
 *          example: PS1115
 *        name:
 *          type: string
 *        dept:
 *          type: string
 *          FK: dept.id
 *    usuario:
 *      type: object
 *      required:
 *      - id
 *      - name
 *      - email
 *      - type
 *      - is_active
 *      - chief
 *      properties:
 *        id:
 *          type: string
 *        name:
 *          type: string
 *        clave:
 *          type: string
 *        email:
 *          type: string
 *        type:
 *          type: integer
 *        is_active:
 *          type: boolean
 *        chief:
 *          type: integer
 *          FK: usuario.id
 *    room:
 *      type: object
 *      required:
 *      - id
 *      - name
 *      - owner_id
 *      - manager_id
 *      - is_active
 *      - description
 *      properties:
 *        id:
 *          type: string
 *          example: MYS-019
 *        name:
 *          type: string
 *        owner_id:
 *          type: string
 *          FK: user.id
 *        manager_id:
 *          type: string
 *          FK: user.id
 *        is_active:
 *          type: boolean
 *        last_used:
 *          type: date
 *        first_used:
 *          type: date
 *    room_request:
 *      type: object
 *      required:
 *      - id
 *      - room_id
 *      - requested_id
 *      - owner_id
 *      - manager_id
 *      - trimester_id
 *      - date
 *      properties:
 *        id:
 *          type: integer
 *          format: int64
 *        room_id:
 *          type: string
 *          example: MYS-019
 *        requested_id:
 *          type: string
 *          FK: usuario.id
 *        owner_id:
 *          type: string
 *          FK: usuario.id
 *        manager_id:
 *          type: string
 *          FK: usuario.id
 *        trimester_id:
 *          type: string
 *          FK: trimester.id
 *        date:
 *          type: date
 *        status:
 *          type: char
 *    room_item:
 *      type: object
 *      required:
 *      - room_id
 *      - trimester_id
 *      - item_id
 *      properties:
 *        id:
 *          multiple: primary key (room_id, trimester_id, item_id)
 *        room_id:
 *          type: string
 *          FK: room.id
 *        trimester_id:
 *          type: string
 *          FK: trimester.id
 *        item_id:
 *          type: integer
 *          FK: item.id
 *        quantity:
 *          type: integer
 *          FK: usuario.id
 *
 *    asignation:
 *      type: object
 *      required:
 *      - id
 *      - room_id
 *      - subject_id
 *      - trimester_id
 *      - date
 *      properties:
 *        id:
 *          type: integer
 *          format: int64
 *        room_id:
 *          type: string
 *          FK: room.id
 *        subject_id:
 *          type: string
 *          FK: subject.id
 *        trimester_id:
 *          type: string
 *          FK: trimester.id
 *        date:
 *          type: date
 *
 *    asig_schedule:
 *      type: object
 *      required:
 *      - id
 *      - asignation_id
 *      properties:
 *        id:
 *          type: integer
 *          format: int(64)
 *        asignation_id:
 *          type: integer
 *          FK: asignation.id
 *        day:
 *          type: string
 *        hour:
 *          type: integer
 *        week:
 *          type: integer
 *
 *    reservation_request:
 *      type: object
 *      required:
 *      - id
 *      - requester_id
 *      - room_id
 *      - subject_id
 *      properties:
 *        id:
 *          type: integer
 *          format: int64
 *        requester_id:
 *          type: string
 *          FK: usuario.id
 *        room_id:
 *          type: string
 *          FK: room.id
 *        subject_id:
 *          type: string
 *          FK: subject.id
 *        send_time:
 *          type: date
 *        trimester_id:
 *          type: string
 *        reason:
 *          type: string
 *        material:
 *          type: string
 *        quantity:
 *          type: integer
 *        status:
 *          type: char
 *          example: A (Aprobado), E (Espera), R (Rechazado)
 *
 *    reservation_request_schedule:
 *      type: object
 *      required:
 *      - id
 *      - reservation_request_id
 *      properties:
 *        id:
 *          type: integer
 *          format: int64
 *        reservation_request_id:
 *          type: integer
 *          FK: reservation_request.id
 *        day:
 *          type: string
 *        hour:
 *          type: integer
 *        week:
 *          type: integer
 *
 */

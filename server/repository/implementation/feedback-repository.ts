import { IFeedbackRepository } from "@repository/interface/Ifeedback-repository";
import { Feedback } from "@entities/feedback";
import { BaseRepository } from "./base-repository";


 export class FeedbackRepository extends BaseRepository<Feedback> implements IFeedbackRepository{
   super(){

   }
}